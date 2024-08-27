import Float "mo:base/Float";
import Result "mo:base/Result";
import Text "mo:base/Text";

actor Calculator {
  public func calculate(operation: Text, num1: Float, num2: Float) : async Result.Result<Float, Text> {
    switch (operation) {
      case ("+") { #ok(num1 + num2) };
      case ("-") { #ok(num1 - num2) };
      case ("*") { #ok(num1 * num2) };
      case ("/") {
        if (num2 == 0) {
          #err("Division by zero")
        } else {
          #ok(num1 / num2)
        }
      };
      case (_) { #err("Invalid operation") };
    }
  };
}