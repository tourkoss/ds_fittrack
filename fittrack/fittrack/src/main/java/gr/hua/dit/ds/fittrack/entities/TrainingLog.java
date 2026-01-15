package gr.hua.dit.ds.fittrack.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "training_logs")
public class TrainingLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private LocalDate date; // Ημερομηνία καταγραφής

    @Column
    private String logType;

    @Column
    private String value;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    public TrainingLog() {}

    public TrainingLog(LocalDate date, String logType, String value, User user) {
        this.date = date;
        this.logType = logType;
        this.value = value;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getLogType() { return logType; }
    public void setLogType(String logType) { this.logType = logType; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
