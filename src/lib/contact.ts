/**
 * Company phone numbers, in one place so the floating Call button and the
 * footer can never drift apart.
 *
 * `display` is exactly how the client wrote them. `tel` is the same number in
 * international format — a `tel:` link starting 07… only dials from inside Sri
 * Lanka, whereas +94… works from anywhere, including a visitor roaming abroad.
 */
export type PhoneNumber = {
  /** As shown on screen. */
  display: string;
  /** E.164, for the tel: href. */
  tel: string;
};

export const PHONE_NUMBERS: PhoneNumber[] = [
  { display: "0774130255", tel: "+94774130255" },
  { display: "0764790033", tel: "+94764790033" },
  { display: "0770301491", tel: "+94770301491" },
];
