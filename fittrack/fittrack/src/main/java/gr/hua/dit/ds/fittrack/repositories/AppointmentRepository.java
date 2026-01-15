package gr.hua.dit.ds.fittrack.repositories;

import gr.hua.dit.ds.fittrack.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    List<Appointment> findByClientUserID(Long clientId);
}
