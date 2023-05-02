import 'package:app/controllers/navigator_controller.dart';
import 'package:app/pages/home_page.dart';
import 'package:app/pages/login_register_page.dart';
import 'package:app/providers/auth_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'mypath.dart';

class Mydelegate extends RouterDelegate<MyPath>
    with ChangeNotifier, PopNavigatorRouterDelegateMixin<MyPath> {
  final WidgetRef ref;

  final GlobalKey<NavigatorState> _navigatorKey = GlobalKey<NavigatorState>();

  Mydelegate(this.ref);

  @override
  Widget build(BuildContext context) {
    final navigation = ref.watch(navigationController);
    final authState = ref.watch(authStateProvider);

    bool logged = false;

    authState.when(
        data: (data) {
          if (data != null) logged = true;
        },
        loading: () { const Text('Loading');},
        error: (e, trace) => const Text('error')
    );

    return Navigator(
      pages: [
        const MaterialPage(child: LoginPage()),
        if(logged) const MaterialPage(child: MapScreen()),
      ],
      onPopPage: (route, result) {
        bool popStatus = route.didPop(result);
        if (popStatus) {
          if (navigation == '/map') {
            ref.read(navigationController.notifier).changeScreen('/login');
          }
        }
        return popStatus;
      },
    );
  }

  @override
  Future<bool> popRoute() {
    if (ref.read(navigationController) == '/map') {
      ref.read(navigationController.notifier).changeScreen('/login');
    }
    return Future.value(false);
  }

  @override
  Future<void> setNewRoutePath(configuration) async {
    // TODO: implement setNewRoutePath
    //quitar async
    //throw UnimplementedError();
  }

  @override
  // TODO: implement navigatorKey
  GlobalKey<NavigatorState>? get navigatorKey => _navigatorKey;
}
