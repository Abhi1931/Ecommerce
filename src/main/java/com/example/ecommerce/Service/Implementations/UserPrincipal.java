package com.example.ecommerce.Service.Implementations;

import com.example.ecommerce.Entity.RoleType;
import com.example.ecommerce.Entity.Sellerdata;
import com.example.ecommerce.Entity.UserData;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private final String username;
    private final String password;
    private final String role;

    @Getter
    private final UserData userData;
    private final Sellerdata sellerdata;

    public UserPrincipal(UserData userData) {
        this.userData = userData;
        this.sellerdata = null;
        this.username = userData.getUsername();
        this.password = userData.getPassword();
        this.role = userData.getRole().getRoleName();
    }

    public UserPrincipal(Sellerdata sellerdata) {
        this.sellerdata = sellerdata;
        this.userData = null;
        this.username = sellerdata.getUsername();
        this.password = sellerdata.getPassword();
        this.role = RoleType.SELLER.name();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() { return password; }

    @Override
    public String getUsername() { return username; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }

    public Sellerdata getSeller() { return this.sellerdata; }

    public boolean isSeller() { return "SELLER".equalsIgnoreCase(role); }
}
