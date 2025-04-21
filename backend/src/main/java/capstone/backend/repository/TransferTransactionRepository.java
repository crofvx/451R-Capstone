package capstone.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import capstone.backend.entity.TransferTransaction;

@Repository
public interface TransferTransactionRepository extends JpaRepository<TransferTransaction, UUID> {
}
