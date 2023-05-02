import 'dart:async';

import 'package:app/utils/type.dart';
import 'package:firebase_database/firebase_database.dart';

class UserSubscription{
  StreamSubscription? userChanged;
  StreamSubscription? userRemoved;

  UserSubscription(String ref, Function(DataSnapshot, UserType) update, Function(DataSnapshot) remove) {
    DatabaseReference readCiclistas = FirebaseDatabase.instance.ref(ref);
    print('*******');
    print(ref);
    userChanged = readCiclistas.onValue.listen((event) {
      if(event.snapshot.exists){
        print('update');
        UserType type = UserType.values.firstWhere((element) => element.name == readCiclistas.parent!.path);
        print(type);
        update(event.snapshot,type);
      }
    });
    userRemoved = readCiclistas.onChildRemoved.listen((event) {
      print('remove');
      remove(event.snapshot);
    });
  }

  void cancel(){
    userChanged?.cancel();
    userRemoved?.cancel();
  }
}