package capstone.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import capstone.backend.entity.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
}
