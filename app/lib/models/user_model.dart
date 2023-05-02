import 'package:firebase_database/firebase_database.dart';
import 'package:app/utils/zone.dart';

class UserModel {
  UserModel(this.uid, this.latitude, this.longitude, this.type, this.speed);

  final String uid;
  final double latitude;
  final double longitude;
  final String type;
  final double speed;


  void updatePositionDB() async{
    updateCurrent();
    updateHistorico();
  }

  void updateCurrent(){
    String zone = Zone.getZone(latitude, longitude);
    DatabaseReference position = FirebaseDatabase.instance.ref("$type/$zone/$uid");

    position.set({
      "Lat" : latitude,
      "Lon" : longitude
    });
  }

  void updateHistorico(){
    DatabaseReference historico = FirebaseDatabase.instance.ref("Historico");

    historico.child(uid).child(DateTime.now().millisecondsSinceEpoch.toString()).set({
      "Lat" : latitude,
      "Lon" : longitude,
      "tipo": type,
      "speed": speed
    });

  }

}