import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:app/utils/auth.dart';

final authenticationProvider = Provider<Auth>((ref) {
  return Auth();
});

final authStateProvider = StreamProvider<User?>((ref) {
  return ref.read(authenticationProvider).authStateChanges;
});