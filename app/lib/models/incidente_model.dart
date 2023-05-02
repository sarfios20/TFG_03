import 'package:app/utils/zone.dart';
import 'package:firebase_database/firebase_database.dart';

class Incidente {
  Incidente(this.uid, this.timestamp, this.latitude, this.longitude);
  final String uid;
  final DateTime timestamp;
  final double latitude;
  final double longitude;

  DatabaseReference dbRef = FirebaseDatabase.instance.ref("Incidente");

  void saveToDB() async{
    String zone = Zone.getZone(latitude, longitude);
    dbRef.child(zone).child(uid).child(timestamp.millisecondsSinceEpoch.toString()).set({
      "Lat" : latitude,
      "Lon" : longitude,
    });
  }

}