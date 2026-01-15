package gr.hua.dit.ds.fittrack.repositories;

import gr.hua.dit.ds.fittrack.entities.TrainingLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingLogRepository extends JpaRepository<TrainingLog, Long> {

    List<TrainingLog> findByUserUserID(Long userId);
}
