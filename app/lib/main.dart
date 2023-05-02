import 'dart:async';
//import 'package:ciclistas/routes/mydelegate.dart';
//import 'package:ciclistas/routes/myparser.dart';
import 'package:app/routes/mydelegate.dart';
import 'package:app/routes/myparser.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    name: 'app',
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends ConsumerWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp.router(
      routerDelegate: Mydelegate(ref),
      routeInformationParser: MyParser(ref),
      title:'Flutter Demo',
      theme:ThemeData(
        primarySwatch: Colors.orange,
      ),
    );
  }
}