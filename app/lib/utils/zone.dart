class Zone {
  static String getZone(double latitude, double longitude){
    double lat = (latitude*100).ceilToDouble();
    double lon = (longitude*100).floorToDouble();

    return "${formatter(lat)};${formatter(lon)}";
  }

  static String formatter(double number){
    if(number.isNegative){
      number = number.abs();
      return "-${number.toStringAsFixed(0).padLeft(4, '0')}";
    }
    return "+${number.toStringAsFixed(0).padLeft(4, '0')}";
  }
}