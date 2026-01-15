package gr.hua.dit.ds.fittrack.services;

import gr.hua.dit.ds.fittrack.entities.TrainingLog;
import gr.hua.dit.ds.fittrack.repositories.TrainingLogRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainingLogService {

    private final TrainingLogRepository trainingLogRepository;

    public TrainingLogService(TrainingLogRepository trainingLogRepository) {
        this.trainingLogRepository = trainingLogRepository;
    }

    @Transactional
    public void saveLog(TrainingLog log) {
        trainingLogRepository.save(log);
    }

    @Transactional
    public List<TrainingLog> getLogsByClient(Long clientId) {
        return trainingLogRepository.findByUserUserID(clientId);
    }

    @Transactional
    public void deleteLog(Long id) {
        trainingLogRepository.deleteById(id);
    }
}
