export class Keyboard {
  private constructor() {}

  private static keyStates: Map<string, boolean> = new Map();
  private static keyCallbacks: Map<string, (state: boolean) => void> =
    new Map();

  public static addMapping(key: string, callback: (state: boolean) => void) {
    this.keyCallbacks.set(key, callback);
  }

  public static removeMapping(key: string) {
    this.keyCallbacks.delete(key);
  }

  public static handleEvent(event: KeyboardEvent) {
    const code = event.code;

    if (!Keyboard.keyCallbacks.has(code)) {
      return;
    }

    event.preventDefault();

    const keyState = event.type === "keydown";

    if (Keyboard.keyStates.get(code) === keyState) {
      return;
    }

    Keyboard.keyStates.set(code, keyState);

    Keyboard.keyCallbacks.get(code)?.(keyState);
  }

  public static registerCallbacks() {
    window.addEventListener("keydown", (event) => Keyboard.handleEvent(event));
    window.addEventListener("keyup", (event) => Keyboard.handleEvent(event));
  }
}
