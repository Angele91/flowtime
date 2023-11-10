import "@testing-library/jest-dom";
import { vi } from "vitest";

class Worker {
  url: string;
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = () => {};
  }

  onmessage(param: any) {
    console.log(param);
  }

  postMessage(msg) {
    this.onmessage(msg);
  }

  addEventListener() {
    return {
      onmessage: this.onmessage,
    };
  }
}

window.Worker = Worker as any;
window.URL.createObjectURL = vi.fn();
window.URL.revokeObjectURL = vi.fn();
HTMLFormElement.prototype.requestSubmit = vi.fn();
