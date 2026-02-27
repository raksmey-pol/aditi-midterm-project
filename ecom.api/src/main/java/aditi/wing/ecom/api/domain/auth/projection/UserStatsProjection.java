package aditi.wing.ecom.api.domain.auth.projection;

public interface UserStatsProjection {
    Long getTotalOrders();
    Double getTotalSpending();
    Long getWishlistItems();
}
