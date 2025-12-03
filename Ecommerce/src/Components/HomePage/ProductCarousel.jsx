import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProductCarousel() {
    const images = [
        '/images/hassle.jpg',
        '/images/Oneplus-nord-ce-4.jpg',
        '/images/GAP-mens-Orange-Hoodie.jpg'
    ];

    useEffect(() => {
        const el = document.getElementById('carouselExample');
        if (el && window.bootstrap) {
            const carousel = new window.bootstrap.Carousel(el, {
                interval: 2000,
                ride: 'carousel',
                pause: false
            });
            carousel.cycle(); // 👈 force autoplay
        }
    }, []);

    return (
        <div className="container-fluid mt-5">
            <h4 >New Arrivals</h4>
            <div
                id="carouselExample"
                className="carousel slide"
                data-bs-ride="carousel"
            >
                <div className="carousel-inner">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={`carousel-item ${index === 0 ? 'active' : ''}`}
                        >
                            <img
                                src={img}
                                className="d-block w-100"
                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                                alt={`Slide ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
}

export default ProductCarousel;
