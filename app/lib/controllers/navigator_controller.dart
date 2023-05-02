import 'package:flutter_riverpod/flutter_riverpod.dart';

final navigationController = StateNotifierProvider<NavigationController, String>((ref) => NavigationController());

class NavigationController extends StateNotifier<String>{

  NavigationController() : super('/login');

  void changeScreen(String newScreenName){
    state = newScreenName;
  }
}