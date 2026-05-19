export function SystemFlowchart() {
  return (
    <svg
      viewBox="0 0 720 520"
      preserveAspectRatio="xMidYMid meet"
      className="mx-auto w-full max-w-3xl rounded-xl border border-[var(--line-subtle)] bg-[#faf9f7]"
      role="img"
      aria-label="System flowchart from customer order to kitchen completion"
    >
      <defs>
        <marker id="flow-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#4a2f22" />
        </marker>
      </defs>
      <rect x="260" y="12" width="200" height="44" rx="8" fill="#0f6c74" />
      <text x="360" y="40" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">
        CUSTOMER
      </text>
      <rect x="230" y="70" width="260" height="36" rx="6" fill="#f6f1e7" stroke="#0f6c74" strokeWidth="2" />
      <text x="360" y="93" textAnchor="middle" fill="#1b1f24" fontSize="11">
        Browse menu · Add to cart
      </text>
      <line x1="360" y1="56" x2="360" y2="70" stroke="#4a2f22" strokeWidth="2" markerEnd="url(#flow-arrow)" />
      <rect x="230" y="118" width="260" height="36" rx="6" fill="#f6f1e7" stroke="#0f6c74" strokeWidth="2" />
      <text x="360" y="141" textAnchor="middle" fill="#1b1f24" fontSize="11">
        Checkout · Place order
      </text>
      <line x1="360" y1="106" x2="360" y2="118" stroke="#4a2f22" strokeWidth="2" markerEnd="url(#flow-arrow)" />
      <rect x="230" y="166" width="260" height="36" rx="6" fill="#d9a441" stroke="#4a2f22" strokeWidth="2" />
      <text x="360" y="189" textAnchor="middle" fill="#4a2f22" fontSize="11" fontWeight="bold">
        Pickup code shown
      </text>
      <line x1="360" y1="154" x2="360" y2="166" stroke="#4a2f22" strokeWidth="2" markerEnd="url(#flow-arrow)" />
      <rect x="500" y="158" width="180" height="52" rx="6" fill="#e8f4f5" stroke="#0f6c74" strokeWidth="2" />
      <text x="590" y="180" textAnchor="middle" fill="#1b1f24" fontSize="10">
        Customer tracks status
      </text>
      <text x="590" y="196" textAnchor="middle" fill="#1b1f24" fontSize="10">
        on their phone
      </text>
      <line x1="490" y1="184" x2="500" y2="184" stroke="#4a2f22" strokeWidth="2" markerEnd="url(#flow-arrow)" />
      <rect x="20" y="230" width="200" height="44" rx="8" fill="#a5422b" />
      <text x="120" y="258" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">
        KITCHEN
      </text>
      <rect x="20" y="288" width="240" height="40" rx="6" fill="#fff0ed" stroke="#a5422b" strokeWidth="2" />
      <text x="140" y="313" textAnchor="middle" fill="#1b1f24" fontSize="10" fontWeight="bold">
        ALERT: Sound + banner + modal
      </text>
      <line x1="360" y1="202" x2="140" y2="288" stroke="#4a2f22" strokeWidth="2" markerEnd="url(#flow-arrow)" />
      <rect x="20" y="342" width="240" height="36" rx="6" fill="#f6f1e7" stroke="#4a2f22" strokeWidth="2" />
      <text x="140" y="365" textAnchor="middle" fill="#1b1f24" fontSize="10">
        Staff taps Acknowledge
      </text>
      <line x1="140" y1="328" x2="140" y2="342" stroke="#4a2f22" strokeWidth="2" markerEnd="url(#flow-arrow)" />
      <rect x="20" y="390" width="240" height="36" rx="6" fill="#f6f1e7" stroke="#4a2f22" strokeWidth="2" />
      <text x="140" y="413" textAnchor="middle" fill="#1b1f24" fontSize="10">
        Pending → Preparing → Ready
      </text>
      <line x1="140" y1="378" x2="140" y2="390" stroke="#4a2f22" strokeWidth="2" markerEnd="url(#flow-arrow)" />
      <rect x="20" y="438" width="240" height="36" rx="6" fill="#0f6c74" />
      <text x="140" y="461" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
        Completed · Customer sees update
      </text>
      <line x1="140" y1="426" x2="140" y2="438" stroke="#4a2f22" strokeWidth="2" markerEnd="url(#flow-arrow)" />
      <rect x="460" y="288" width="240" height="56" rx="6" fill="#f6f1e7" stroke="#d9a441" strokeWidth="2" />
      <text x="580" y="312" textAnchor="middle" fill="#1b1f24" fontSize="10">
        Pay in store at pickup
      </text>
      <text x="580" y="328" textAnchor="middle" fill="#1b1f24" fontSize="10">
        (no card charge online)
      </text>
      <line
        x1="260"
        y1="408"
        x2="460"
        y2="320"
        stroke="#4a2f22"
        strokeWidth="1.5"
        strokeDasharray="4"
        markerEnd="url(#flow-arrow)"
      />
    </svg>
  );
}
