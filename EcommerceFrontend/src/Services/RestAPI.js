import axios from 'axios';


const BASE_URL = 'http://localhost:8080/essentials';


const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Send cookies (for refresh token)
    timeout: 10000, // 10 second timeout
});


const TokenManager = {
    getAccessToken: () => localStorage.getItem("accessToken"),
    setAccessToken: (token) => localStorage.setItem("accessToken", token),
    removeAccessToken: () => localStorage.removeItem("accessToken"),


    isTokenExpiringSoon: (token) => {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            const expirationTime = payload.exp;

            return (expirationTime - currentTime) < 120;
        } catch (error) {
            console.error('Error parsing token:', error);
            return true;
        }
    }
};

api.interceptors.request.use(
    async (config) => {
        const token = TokenManager.getAccessToken();

        if (token) {

            if (TokenManager.isTokenExpiringSoon(token)) {
                try {
                    await refreshTokenIfNeeded();
                    const newToken = TokenManager.getAccessToken();
                    config.headers.Authorization = `Bearer ${newToken}`;
                } catch (error) {
                    console.error('Failed to refresh token:', error);

                    config.headers.Authorization = `Bearer ${token}`;
                }
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};


const refreshTokenIfNeeded = async () => {
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        });
    }

    isRefreshing = true;

    try {
        const response = await axios.get(`${BASE_URL}/user/refresh-token`, {
            withCredentials: true
        });

        const newToken = response.data.accessToken;
        TokenManager.setAccessToken(newToken);


        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        processQueue(null, newToken);
        return newToken;
    } catch (error) {
        processQueue(error, null);
        TokenManager.removeAccessToken();

        window.location.href = "/login";
        throw error;
    } finally {
        isRefreshing = false;
    }
};


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    return api(originalRequest);
                });
            }

            try {
                const newToken = await refreshTokenIfNeeded();
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }


        if (error.response?.status >= 500) {
            console.error('Server error:', error.response.data);
        }

        return Promise.reject(error);
    }
);


export const login = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, data, {
            withCredentials: true,
        });


        if (response.data.accessToken) {
            TokenManager.setAccessToken(response.data.accessToken);
        }

        return response;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const Cregister = (data) => axios.post(`${BASE_URL}/customer/register`, data, {
    withCredentials: true,
});

export const Sregister = (data) => axios.post(`${BASE_URL}/seller/registers`, data, {
    withCredentials: true,
});

export const logout = async () => {
    try {

        await api.post('/user/logout');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        TokenManager.removeAccessToken();
        window.location.href = "/login";
    }
};

//  USER APIs
export const getAllUsers = () => api.get('/admin/alldata');
export const getUserById = (id) => api.get(`/user/profile/${id}`);
export const updateUserById = (id, data) => api.put(`/user/profile/${id}`, data);
export const createUser = (data) => api.post('/user/adduser', data);
export const deleteUserById = (id) => api.delete(`/user/profile/${id}`);

//  SELLER APIs
export const getSellers = () => api.get('/admin/sellers');
export const getSingleSeller = (id) => api.get(`/seller/${id}`);
export const updateSellerById = (id, data) => api.put(`/seller/${id}`, data);
export const deleteSellerById = (sid,id) => api.delete(`/seller/${sid}/product/${id}`);
export const createSeller = (data) => api.post('/seller/addseller',data);
export const getSellerProducts = () => api.get('/seller/products');
export const getSellerProductStats = () => api.get('/seller/productStats');

//  ADMIN APIs
export const updateUserbyID = (id, data) => api.put(`/admin/userprofile/${id}`,data);
export const updateSellerByID = (id, data) => api.put(`/admin/seller/${id}`, data);
export const addUser = (data) => api.post(`/admin/userprofile/adduser`, data);
export const getAllOrders =() => api.get('/admin/allorders');
export const getAllSellers = () => api.get("/admin/allsellers");
export const createSeler = (data) => api.post('/admin/seller/addseller', data);
export const getAllSellerProducts =() => api.get('/admin/sproducts');
export const getAdminProducts = () => api.get('/admin/products');


//  PRODUCT APIs
export const getProductById = (id) => api.get(`/products/${id}`);
export const getProductByCategories = (category) => api.get(`/products/category/${encodeURIComponent(category)}`);
export const getAllProducts = () => api.get('/products/allproducts');
export const addProduct = (data) => api.post('/seller/addprods', data);
export const updateProductById = (pid, data) => api.put(`/products/${pid}`, data);
export const deleteProductById = (pid) => api.delete(`/admin/products/${pid}`);
export const searchProducts = (kword) => api.get('/products/search',{params:{kword}});

//  WISHLIST APIs
export const getWishlistProducts = ()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         => api.get('/user/wishlist');
export const addToWishlist = (productId) => api.post(`/user/wishlist/add/${productId}`);
export const clearWishlist = () => api.delete(`/user/wishlist/clear`);
export const removeWishlist = (productID) => api.delete(`/user/wishlist/remove/${productID}`);

//  CART APIs
export const getCartItems = () => api.get('/user/cart');
export const addToCart = (productId, quantity) => api.post(`/user/cart/add/${productId}?quantity=${quantity}`);
export const deleteSingleCartItem = (productId) => api.delete(`/user/cart/delete/${productId}`);
export const clearCart = () => api.delete('/user/cart/clear');

//  ORDER APIs
export const buyNow = (productId, quantity, address) => {

    const body = (typeof address === 'string') ? JSON.stringify(address) : address;
    return api.post(`/user/orders/place/${productId}?quantity=${quantity}`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const buySingleProduct = (productId) => api.post(`/user/orders/place/${productId}`);
export const buyAllCartItems = () => api.post('/user/orders/buyall');
export const getUserOrders = () => api.get('/user/orders/all');



export async function deleteSellerByID(sid, pid) {
    try {
        return await deleteSellerById(sid,pid);
    } catch (err) {

        console.error("API delete error wrapper", err);
        throw err;
    }
}


//  Error handling helper
export const handleApiError = (error) => {
    if (error.response) {

        const { status, data } = error.response;

        switch (status) {
            case 401:
                return 'Authentication failed. Please login again.';
            case 403:
                return 'Access denied. You do not have permission.';
            case 404:
                return 'Resource not found.';
            case 500:
                return 'Server error. Please try again later.';
            default:
                return data?.message || 'An error occurred. Please try again.';
        }
    } else if (error.request) {

        return 'Network error. Please check your connection.';
    } else {

        return 'An unexpected error occurred.';
    }
};

//  token manager
export { TokenManager };

export default api;