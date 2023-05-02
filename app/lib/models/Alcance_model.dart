import 'package:firebase_database/firebase_database.dart';

class Alcance{
  Alcance(this.uid, this.cyclistId, this.timestamp, this.latitude, this.longitude, this.speedAlcance, this.speedAlerta);
  final String uid;
  final String cyclistId;
  final DateTime timestamp;
  final double latitude;
  final double longitude;
  final double speedAlerta;
  final double speedAlcance;


  void alcanceDB(){
    DatabaseReference alertaRef = FirebaseDatabase.instance.ref("Alcance");

    alertaRef.child("Ciclistas").child(cyclistId).child(timestamp.millisecondsSinceEpoch.toString()).set({
      "Lat" : latitude,
      "Lon" : longitude,
      "IdConductor": uid,
      "speed_alcance": speedAlcance,
      "speed_alerta": speedAlerta
    });

    alertaRef.child("Conductores").child(uid).child(timestamp.millisecondsSinceEpoch.toString()).set({
      "Lat" : latitude,
      "Lon" : longitude,
      "IdCiclista": cyclistId,
      "speed_alcance": speedAlcance,
      "speed_alerta": speedAlerta
    });
  }
}