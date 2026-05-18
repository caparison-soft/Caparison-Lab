'use client';

export default function LocalDate({ iso }) {
  const d = new Date(iso);
  return (
    <>
      {d.toLocaleDateString()} at {d.toLocaleTimeString()}
    </>
  );
}
