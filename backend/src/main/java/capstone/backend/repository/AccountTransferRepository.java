package capstone.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import capstone.backend.entity.AccountTransfer;
import capstone.backend.entity.AccountTransferId;

@Repository
public interface AccountTransferRepository extends JpaRepository<AccountTransfer, AccountTransferId> {
}
