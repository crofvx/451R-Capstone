package capstone.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import capstone.backend.entity.SingleAccountTransaction;

@Repository
public interface SingleAccountTransactionRepository extends JpaRepository<SingleAccountTransaction, UUID> {
}
