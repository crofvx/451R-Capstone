
package capstone.backend.entity;

import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.UUID;
import org.hibernate.annotations.Check;

@Check(constraints = "category IN ('housing', 'transportation', 'food', 'healthcare', 'debt', 'savings', 'personal', 'miscellaneous')")

@Entity
@Table(
	    name = "budgets",
	    uniqueConstraints = {
	        @UniqueConstraint(columnNames = {"user_id", "category", "month", "year"}, name = "uq_userBudget")
	    }
	)
public class Budget {
    @Id
    @GeneratedValue(generator = "uuid2")
		@UuidGenerator
    @Column(name = "budget_id", columnDefinition = "uniqueidentifier")
    private UUID budgetId;

    @Column(name = "category", length = 30, nullable = false)
    private String category;

    @Column(name = "month", nullable = false)
    private int month;

    @Column(name = "year", nullable = false)
    private int year;

    @Column(name = "allocated_amount", precision = 18, scale = 2, nullable = false)
    private BigDecimal allocatedAmount;

    @Column(name = "user_id", columnDefinition = "uniqueidentifier", nullable = false)
    private UUID userId;
    


    // Constructors
    public Budget() {
    }

    public Budget(String category, int month, int year, BigDecimal allocatedAmount, UUID userId) {
        this.category = category;
        this.month = month;
        this.year = year;
        this.allocatedAmount = allocatedAmount;
        this.userId = userId;
    }

    // Getters and Setters
    public UUID getBudgetId() {
        return budgetId;
    }

    public void setBudgetId(UUID budgetId) {
        this.budgetId = budgetId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public BigDecimal getAllocatedAmount() {
        return allocatedAmount;
    }

    public void setAllocatedAmount(BigDecimal allocatedAmount) {
        this.allocatedAmount = allocatedAmount;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}