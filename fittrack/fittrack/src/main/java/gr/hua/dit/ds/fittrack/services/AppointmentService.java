package gr.hua.dit.ds.fittrack.services;

import gr.hua.dit.ds.fittrack.entities.Appointment;
import gr.hua.dit.ds.fittrack.entities.Availability;
import gr.hua.dit.ds.fittrack.entities.Status;
import gr.hua.dit.ds.fittrack.repositories.AppointmentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AvailabilityService availabilityService;

    public AppointmentService(AppointmentRepository appointmentRepository, AvailabilityService availabilityService) {
        this.appointmentRepository = appointmentRepository;
        this.availabilityService = availabilityService;
    }

    @Transactional
    public boolean createAppointment(Appointment appointment, int availabilityId) {
        Optional<Availability> slotOpt = availabilityService.getAvailabilityById(availabilityId);

        if (slotOpt.isEmpty()) {
            return false;
        }

        Availability slot = slotOpt.get();

        if (Boolean.TRUE.equals(slot.getBooked())) {
            return false;
        }

        appointment.setAvailability(slot);
        appointment.setStatus(Status.CONFIRMED);

        slot.setBooked(true);

        availabilityService.saveAvailability(slot);
        appointmentRepository.save(appointment);

        return true;
    }

    @Transactional
    public List<Appointment> getAppointmentsByClientId(Long clientId) {
        return appointmentRepository.findByClientUserID(clientId);
    }
}
