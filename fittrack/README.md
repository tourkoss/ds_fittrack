# Ομάδα 3 [FitTrack Application]
- Μέλη:
    - Αναστάσιος Τουρκοκώστας it2022103
    - Γεώργιος Κιούρας it2022036
    - Ιωάννης Κυπραίος it2022049

# Github repo [Link]
- Μπορείτε να δείτε τον κώδικα του project μας στο παρακάτω link:
    # mylink
        - Για να δείτε τον κώδικα του backend (Controllers / Entities etc.) ακολουθήστε το παρακάτω path:
            `src/main/java/gr/hua/dit/ds/fittrack`

# ***COMMANDS [Backend]***
    - Εντολές εκτέλεσης παραδοτέου (Spring Boot)
        - mvn clean package
        - java -jar .\target\fittrack-0.0.1-SNAPSHOT.jar
        - [Alternatively run via IDE: Run 'FittrackApplication.java']
        - Ctrl + C [Stop]

# ***COMMANDS [Frontend]***
    - Εντολές εκτέλεσης (Node.js Server)
        - Ανοίξτε τερματικό στον φάκελο του Frontend [ds_fittrack\fittrack\fittrack\src\main\resources\src (front-end)].
        - npm init -y
        - npm install express
        - node serverInit.js
        - Open browser at: http://localhost:7000

# Βασικές παραδοχές εργασίας & Λειτουργικότητα

1. **Διαχωρισμός Ρόλων:**
   Η εφαρμογή υποστηρίζει δύο διακριτούς ρόλους χρηστών που επιλέγονται κατά την εγγραφή (Sign Up):
   - **Trainer:** Διαχειρίζεται το πρόγραμμά του και δημιουργεί διαθέσιμα slots για προπόνηση.
   - **Trainee (User):** Κλείνει ραντεβού και καταγράφει την ατομική του πρόοδο.

2. **Διαχείριση Διαθεσιμότητας (Slots):**
   - Ένα slot δημιουργείται μόνο από τον Trainer.
   - Έχει συγκεκριμένη ημερομηνία, ώρα και τύπο δραστηριότητας (π.χ. Personal Training, Yoga).
   - Κατάσταση Slot:
     - **Available:** Εμφανίζεται στην αρχική σελίδα και μπορεί να κλειστεί από Trainees.
     - **Booked:** Έχει δεσμευτεί από Trainee και παύει να είναι διαθέσιμο για άλλους.

3. **Κανόνες Κράτησης (Booking):**
   - Ένας Trainee μπορεί να κλείσει οποιοδήποτε "Available" slot.
   - Μόλις γίνει η κράτηση, το slot ενημερώνεται αυτόματα σε "Booked" και συνδέεται με τον λογαριασμό του Trainee.

4. **Καταγραφή Προόδου (Trainee Logs):**
   - Κάθε Trainee έχει το δικό του προσωπικό ιστορικό (Logs).
   - Μπορεί να καταχωρήσει: Βάρος, Τρέξιμο, Κολύμβηση κ.α.
   - Τα δεδομένα αυτά είναι προσωπικά και εμφανίζονται μόνο στο Dashboard του συγκεκριμένου χρήστη.

5. **Ασφάλεια & Authentication:**
   - Χρησιμοποιείται **JWT (JSON Web Token)** για την πιστοποίηση.
   - Το Frontend εξυπηρετείται από Node.js server (Port 3000) και επικοινωνεί με το Backend (Port 8080).