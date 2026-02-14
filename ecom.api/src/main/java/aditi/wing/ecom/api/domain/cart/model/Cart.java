package aditi.wing.ecom.api.domain.cart.model;

import aditi.wing.ecom.api.domain.auth.model.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="cart")
@Data
public class Cart {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    private String sessionId;

    private LocalDateTime expiresAt;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
