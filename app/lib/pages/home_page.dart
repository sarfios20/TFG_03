import 'dart:async';
import 'package:app/models/Alcance_model.dart';
import 'package:app/models/alerta_model.dart';
import 'package:app/providers/auth_provider.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:app/utils/auth.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:app/utils/user_subscription.dart';
import 'package:flutter_ringtone_player/flutter_ringtone_player.dart';
import 'package:app/utils/type.dart';
import 'package:app/models/user_model.dart';
import 'package:app/models/incidente_model.dart';
import 'package:app/utils/zone.dart';
import 'package:flutter_background/flutter_background.dart';

class MapScreen extends ConsumerStatefulWidget {
  const MapScreen({Key? key}) : super(key: key);
//
  @override
  _MapScreenState createState() => _MapScreenState();
}

class _MapScreenState extends ConsumerState<MapScreen> with WidgetsBindingObserver {

  DatabaseReference updateHistorico = FirebaseDatabase.instance.ref("Historico");
  
  bool isCiclista = true;
  UserType type = UserType.Ciclista;
  bool isReady = false;
  Position? _position;
  String currentZone = "";
  double distanceAlert = 250.0;
  double distanceAlcance = 100.0;
  double distanceUpdate = 10.0;
  int alertCooldown = 30;
  int alcanceCooldown = 30;
  DateTime timeLast = DateTime.now();
  DateTime timeLast2 = DateTime.now();

  Map<String, UserSubscription> zonesListeningCyclist = {};
  Map<String, UserSubscription> zonesListeningDriver = {};
  Map<String, double> alertados = {};

  final Set<Marker> _markers = {};

  final User? user = Auth().currentUser;

  late BitmapDescriptor cyclistIcon;
  late BitmapDescriptor carIcon;

  final LocationSettings locationSettings = const LocationSettings(
    accuracy: LocationAccuracy.bestForNavigation,
    distanceFilter: 10,
  );
  final LocationSettings locationSettings2 = const LocationSettings(
    accuracy: LocationAccuracy.bestForNavigation,
    distanceFilter: 0,
  );

  late GoogleMapController _googleMapController;

  Future<void> signOut() async{
    print("----------");
    cancelSubscriptions(UserType.Ciclista);
    cancelSubscriptions(UserType.Conductor);
    removeUserFromDB(type, currentZone);
    await Auth().singOut();
  }

  void incidente() {
    String uid = ref.read(authenticationProvider).currentUser!.uid;
    Incidente incidente = Incidente(uid, DateTime.now(), _position!.latitude, _position!.longitude);
    incidente.saveToDB();
  }

  void removeUserFromDB(UserType type, String zone){
    String uid = ref.read(authenticationProvider).currentUser!.uid;
    DatabaseReference updateuser = FirebaseDatabase.instance.ref("${type.name}/$zone/$uid");
    updateuser.remove();
  }

  void removeMarkerFromDB (DataSnapshot snapshot) {
    if (!snapshot.exists) {
      return;
    }
    Map<dynamic, dynamic> map = snapshot.value as Map<dynamic, dynamic>;

    setState(() {
      _markers.removeWhere((element){
        if(element.markerId.value == 'User'){
          return false;
        }
        return element.position == LatLng(map['Lat'], map['Lon']);
      });
    });
  }

  void alcanceDB(String cyclistId, double latitude, double longitude,double speedAlcance,double speedAlerta){
    String uid = ref.read(authenticationProvider).currentUser!.uid;

    Alcance alcance = Alcance(uid, cyclistId, DateTime.now(), latitude, longitude, speedAlcance, speedAlerta);
    alcance.alcanceDB();

  }

  void alertaDB(String cyclistId, double latitude, double longitude){
    String uid = ref.read(authenticationProvider).currentUser!.uid;

    Alerta alerta = Alerta(uid, cyclistId, DateTime.now(), latitude, longitude);
    alerta.alertaDB();
  }

  void checkDistance(String cyclistId, double lat, double lon){
    double distance = Geolocator.distanceBetween(_position!.latitude, _position!.longitude, lat, lon);
    if(distance > distanceAlert){
      alertados.remove(cyclistId);
      return;
    }
    if(!alertados.containsKey(cyclistId)){
      alertados[cyclistId] = _position!.speed;
    }
    DateTime curent = DateTime.now();
    final difference = curent.difference(timeLast).inSeconds;
    final difference2 = curent.difference(timeLast2).inSeconds;
    if(distance < distanceAlcance && difference2 > alcanceCooldown){
      alcanceDB(cyclistId, lat, lon, _position!.speed, alertados[cyclistId]!);
      timeLast2 = DateTime.now();
    }
    if(difference < alertCooldown){
      return;
    }
    alertaDB(cyclistId, lat, lon);
    alert();
    timeLast = DateTime.now();
  }

  void addMarkerFromDB (DataSnapshot snapshot, UserType type){
    if (!snapshot.exists) {
      return;
    }
    String uid = ref.read(authenticationProvider).currentUser!.uid;
    BitmapDescriptor icon = carIcon;
    if(type == UserType.Ciclista){
      icon = cyclistIcon;
    }

    Map<dynamic, dynamic> map = snapshot.value as Map<dynamic, dynamic>;

    map.forEach((key, value) {
      if(uid != key){
        Marker user = Marker(
          markerId: MarkerId(key),
          position: LatLng(value['Lat'], value['Lon']),
          icon: icon,
        );
        setState(() {
          _markers.removeWhere((element) => element.markerId.value == key);
          _markers.add(user);
        });
        if(!isCiclista){
          checkDistance(key, value['Lat'], value['Lon']);
        }
      }
    });
  }

  void addUserMarker(){
    Marker marker = Marker(
      markerId: const MarkerId("User"),
      position: LatLng(_position!.latitude, _position!.longitude),
    );
    setState(() {
      _markers.removeWhere((element) => element.markerId == const MarkerId("User"));
      _markers.add(marker);
    });
  }

  void removeAllexceptUser(){
    setState(() {
      _markers.removeWhere((element) => element.markerId != const MarkerId('User'));
    });
  }

  void updateMapPosition(){
    addUserMarker();
    if(isReady){
      _googleMapController.animateCamera(
        CameraUpdate.newCameraPosition(
          CameraPosition(
            target: LatLng(_position!.latitude, _position!.longitude),
            zoom: 17.0,
          ),
        ),
      );
    }
  }
  void updateZone(){
    String newZone = Zone.getZone(_position!.latitude, _position!.longitude);
    if(newZone != currentZone){
      if(isCiclista){
        removeUserFromDB(UserType.Ciclista, currentZone);
      }else{
        removeUserFromDB(UserType.Conductor, currentZone);
      }
      currentZone = newZone;
    }
  }

  void getUserFromZone(UserType type){

    Map<String, UserSubscription> zones = zonesListeningCyclist;
    if(type.name == UserType.Conductor.name){
      zones = zonesListeningDriver;
    }

    zones.forEach((key, value) {
      getUserPositions(type, key);
    });
  }

  void getUserPositions(UserType type, String zone) async {
    DatabaseReference readCiclistas = FirebaseDatabase.instance.ref("${type.name}/$zone");
    final snapshot = await readCiclistas.get();
    addMarkerFromDB(snapshot, type);
  }

  List<String> getAdjacentZones(){

    var aux = currentZone.split(';');

    int lat = int.parse(aux[0]);
    int lon = int.parse(aux[1]);

    List<String> zones = List.empty(growable: true);
    for (int i = -1; i < 2; i++) {
      for (int j = -1; j < 2; j++) {

        int newLat = lat - i;
        int newLon = lon - j;

        Position position = Position.fromMap({'latitude': newLat/100, 'longitude': newLon/100});
        zones.add(Zone.getZone(position.latitude, position.longitude));
      }
    }

    return zones;
  }

  void subscribeToZones(UserType type){
    List<String> newZones = getAdjacentZones();

    Map<String, UserSubscription> zones = zonesListeningCyclist;
    if(type.name == UserType.Conductor.name){
      zones = zonesListeningDriver;
    }

    //nuevos
    for (var newZone in newZones) {
      if(!zones.containsKey(newZone)){
        UserSubscription ciclistSubscription = UserSubscription("${type.name}/$newZone", addMarkerFromDB, removeMarkerFromDB);
        zones[newZone] = ciclistSubscription;
      }
    }

    final remover = zones.keys.where((key) => !zones.containsKey(key));
//eliminar
    for (var key in remover) {
      zones[key]?.cancel();
      zones.remove(key);
    }

  }

  void cancelSubscriptions(UserType type){

    Map<String, UserSubscription> zones = zonesListeningCyclist;
    if(type.name == UserType.Conductor.name){
      zones = zonesListeningDriver;
    }

    zones.forEach((key, value) {
      value.cancel();
    });
  }

  void removeType(UserType type){

    BitmapDescriptor icon = carIcon;
    if(type == UserType.Ciclista){
      icon = cyclistIcon;
    }

    setState(() {
      _markers.removeWhere((element){
        if(element.markerId.value == 'User'){
          return false;
        }
        return element.icon == icon;
      });
    });
  }

  void ciclista(){
    removeUserFromDB(UserType.Conductor, currentZone);
    updatePositionDB();
    subscribeToZones(UserType.Conductor);
    subscribeToZones(UserType.Ciclista);
    getUserFromZone(UserType.Ciclista);
    getUserFromZone(UserType.Conductor);
  }

  void conductor(){
    removeUserFromDB(UserType.Ciclista, currentZone);
    updatePositionDB();
    subscribeToZones(UserType.Conductor);
    subscribeToZones(UserType.Ciclista);
    getUserFromZone(UserType.Ciclista);
    getUserFromZone(UserType.Conductor);
    checkAll();
  }

  void databaseSwitch() {
    if(isCiclista){
      ciclista();
    }else{
      conductor();
    }
  }

  void updatePositionDB(){
    String uid = ref.read(authenticationProvider).currentUser!.uid;
    UserModel user = UserModel(uid, _position!.latitude, _position!.longitude, type.name, _position!.speed);

    user.updatePositionDB();
  }

  void alert(){
    FlutterRingtonePlayer.playNotification();
  }

  void checkAll(){
    for (var marker in _markers) {
      if(marker.markerId != const MarkerId("User")){
        if(marker.icon == cyclistIcon){
          checkDistance(marker.markerId.value, marker.position.latitude, marker.position.longitude);
        }
      }
    }
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    BitmapDescriptor.fromAssetImage(const ImageConfiguration(size: Size(12, 12)),
        'assets/pedal_bike.png')
        .then((d) {
      cyclistIcon = d;
    });

    BitmapDescriptor.fromAssetImage(const ImageConfiguration(size: Size(12, 12)),
        'assets/car2.png')
        .then((d) {
      carIcon = d;
    });

    Geolocator.getCurrentPosition().then((position){
      _position = position;
      updateZone();
      ciclista();
      updateMapPosition();
    });



    Geolocator.getPositionStream(locationSettings: locationSettings2).listen((Position? position) {
      if(position != null){
        double distance = Geolocator.distanceBetween(_position!.latitude, _position!.longitude, position.latitude, position.longitude);
        _position = position;

        if(distance > distanceUpdate){
          updatePositionDB();
        }
        String zone = currentZone;
        updateZone();
        if(zone != currentZone){
          subscribeToZones(type);
        }

        if(!isCiclista){
          checkAll();
        }
        updateMapPosition();
      }
    });
  }

  @override
  void dispose() {
    _googleMapController.dispose();
    cancelSubscriptions(UserType.Ciclista);
    cancelSubscriptions(UserType.Conductor);
    signOut();
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    if(state != AppLifecycleState.resumed){
      removeUserFromDB(type, currentZone);
    }else{
      updatePositionDB();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          if (_position != null) Expanded(
            child: GoogleMap(
              initialCameraPosition: CameraPosition(
                target: LatLng(_position!.latitude, _position!.longitude),
                zoom: 17.0,
              ),
              myLocationButtonEnabled: false,
              zoomControlsEnabled: false,
              onMapCreated: (GoogleMapController controller) {
                  _googleMapController = controller;
                  isReady = true;
                },
              markers: _markers,
            ),
          ),

          Row(
            children: [
              ElevatedButton(
                  onPressed: isCiclista ? incidente : null,
                  child: const Text('Incidente')
              ),
              ElevatedButton(
                  onPressed: signOut,
                  child: const Text('Sign Out')
              ),
              const Text('Conductor'),
              Switch(
                  value: isCiclista,
                  onChanged: (bool value) {
                    type = UserType.Ciclista;
                    if(isCiclista){
                      type = UserType.Conductor;
                    }
                    setState(() {
                      isCiclista = !isCiclista;
                    });
                    databaseSwitch();
                  },
              ),
              const Text('Ciclista'),
            ],
          ),
        ],
      ),
    );
  }
}