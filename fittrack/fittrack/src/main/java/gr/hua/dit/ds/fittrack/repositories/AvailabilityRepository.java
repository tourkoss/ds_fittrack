package gr.hua.dit.ds.fittrack.repositories;

import gr.hua.dit.ds.fittrack.entities.Availability;
import gr.hua.dit.ds.fittrack.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Integer> {
    List<Availability> findByTrainer(User trainer);
    List<Availability> findByIsBookedFalse();
}
