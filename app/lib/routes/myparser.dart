import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'mypath.dart';

class MyParser extends RouteInformationParser<MyPath> {
  final WidgetRef ref;

  MyParser(this.ref);

  @override
  Future<MyPath> parseRouteInformation(RouteInformation routeInformation) async {

    String? nullableString = routeInformation.location;

    if (nullableString != null) {
      final uri = Uri.parse(nullableString);

      if (uri.pathSegments.isEmpty){
        return MyPath.home();
      }
    }

    return MyPath.unknown();
  }

}