// Payment subtree layout. The enrollment gateway (HomeClient) renders its own
// inline header and owns the full viewport, so this subtree must NOT show the
// platform header/footer. PlatformChrome (wired in the root layout) already
// returns bare children for any /payment* path.
//
// The `dark` class here forces the payment world to stay dark regardless of the
// platform theme — the gateway keeps its original design (it's on the untouched
// list) and never participates in light mode.
export default function PaymentLayout({ children }) {
  return <div className="dark">{children}</div>;
}
