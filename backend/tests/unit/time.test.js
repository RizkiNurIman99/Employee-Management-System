import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getAttendanceStatus,
  getWibTime,
  isCheckInAllowed,
  isCheckOutAllowed,
} from "../../src/config/time.js";

// ─── Helper mock jam WIB ──────────────────────────────────────
const mockWibTime = (hour, minute = 0) => {
  // Buat tanggal hari ini dengan jam WIB yang diinginkan
  const fakeDate = new Date();
  // WIB = UTC+7, jadi kurangi 7 jam untuk set UTC yang benar
  fakeDate.setUTCHours(hour - 7, minute, 0, 0);
  vi.setSystemTime(fakeDate);
};

beforeEach(() => {
  vi.useFakeTimers(); // aktifkan fake timer sebelum tiap test
});

afterEach(() => {
  vi.useRealTimers(); // kembalikan ke waktu real setelah tiap test
});

// ─── isCheckInAllowed ─────────────────────────────────────────
describe("isCheckInAllowed", () => {
  it("05:00 WIB → ditolak (terlalu pagi)", () => {
    mockWibTime(5, 0);
    const { nowJakarta } = getWibTime();
    expect(isCheckInAllowed(nowJakarta)).toBe(false);
  });

  it("06:29 WIB → ditolak (belum buka)", () => {
    mockWibTime(6, 29);
    const { nowJakarta } = getWibTime();
    expect(isCheckInAllowed(nowJakarta)).toBe(false);
  });

  it("06:30 WIB → diterima (tepat buka)", () => {
    mockWibTime(6, 30);
    const { nowJakarta } = getWibTime();
    expect(isCheckInAllowed(nowJakarta)).toBe(true);
  });

  it("07:00 WIB → diterima", () => {
    mockWibTime(7, 0);
    const { nowJakarta } = getWibTime();
    expect(isCheckInAllowed(nowJakarta)).toBe(true);
  });

  it("07:45 WIB → diterima (batas akhir)", () => {
    mockWibTime(7, 45);
    const { nowJakarta } = getWibTime();
    expect(isCheckInAllowed(nowJakarta)).toBe(true);
  });

  it("07:46 WIB → ditolak (lewat batas)", () => {
    mockWibTime(7, 46);
    const { nowJakarta } = getWibTime();
    expect(isCheckInAllowed(nowJakarta)).toBe(false);
  });

  it("09:00 WIB → ditolak", () => {
    mockWibTime(9, 0);
    const { nowJakarta } = getWibTime();
    expect(isCheckInAllowed(nowJakarta)).toBe(false);
  });
});

// ─── isCheckOutAllowed ────────────────────────────────────────
describe("isCheckOutAllowed", () => {
  it("14:59 WIB → ditolak (belum buka)", () => {
    mockWibTime(14, 59);
    const { nowJakarta } = getWibTime();
    expect(isCheckOutAllowed(nowJakarta)).toBe(false);
  });

  it("15:00 WIB → diterima (tepat buka)", () => {
    mockWibTime(15, 0);
    const { nowJakarta } = getWibTime();
    expect(isCheckOutAllowed(nowJakarta)).toBe(true);
  });

  it("15:30 WIB → diterima", () => {
    mockWibTime(15, 30);
    const { nowJakarta } = getWibTime();
    expect(isCheckOutAllowed(nowJakarta)).toBe(true);
  });

  it("16:00 WIB → diterima (batas akhir)", () => {
    mockWibTime(16, 0);
    const { nowJakarta } = getWibTime();
    expect(isCheckOutAllowed(nowJakarta)).toBe(true);
  });

  it("16:01 WIB → ditolak (lewat batas)", () => {
    mockWibTime(16, 1);
    const { nowJakarta } = getWibTime();
    expect(isCheckOutAllowed(nowJakarta)).toBe(false);
  });

  it("20:00 WIB → ditolak", () => {
    mockWibTime(20, 0);
    const { nowJakarta } = getWibTime();
    expect(isCheckOutAllowed(nowJakarta)).toBe(false);
  });
});

// ─── getAttendanceStatus ──────────────────────────────────────
describe("getAttendanceStatus", () => {
  it("06:30 WIB → On-Time", () => {
    mockWibTime(6, 30);
    const { nowJakarta } = getWibTime();
    expect(getAttendanceStatus(nowJakarta)).toBe("On-Time");
  });

  it("07:00 WIB → Late (setelah 06:30)", () => {
    mockWibTime(7, 0);
    const { nowJakarta } = getWibTime();
    expect(getAttendanceStatus(nowJakarta)).toBe("Late");
  });
});
