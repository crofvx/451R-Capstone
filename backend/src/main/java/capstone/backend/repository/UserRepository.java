package capstone.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import capstone.backend.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
	Optional<User> findUserByEmail(String email);
}
