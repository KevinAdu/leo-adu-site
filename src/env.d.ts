/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user?: {
      id: string;
      email: string;
      name?: string | null;
    };
    session?: {
      id: string;
      userId: string;
      expiresAt: Date;
    };
  }
}
