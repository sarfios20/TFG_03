class MyPath {
  final bool _isHome;


  MyPath.home() : _isHome = true;
  MyPath.unknown() : _isHome = false;

  bool get isHomePage => _isHome;
}