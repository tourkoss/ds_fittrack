package gr.hua.dit.ds.fittrack.services;

import gr.hua.dit.ds.fittrack.entities.Availability;
import gr.hua.dit.ds.fittrack.repositories.AvailabilityRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AvailabilityService {

    private final AvailabilityRepository availabilityRepository;

    public AvailabilityService(AvailabilityRepository availabilityRepository) {
        this.availabilityRepository = availabilityRepository;
    }

    @Transactional
    public List<Availability> getAllAvailabilities() {
        return availabilityRepository.findAll();
    }

    @Transactional
    public Optional<Availability> getAvailabilityById(Integer id) {
        return availabilityRepository.findById(id);
    }

    @Transactional
    public void saveAvailability(Availability availability) {
        availabilityRepository.save(availability);
    }

    @Transactional
    public void deleteAvailability(Integer id) {
        availabilityRepository.deleteById(id);
    }
}
