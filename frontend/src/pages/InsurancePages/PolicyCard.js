import React from 'react';

const renderValue = (value) => {
  if (typeof value === 'object' && value !== null) {
    return (
      <div className="ms-3">
        {Object.entries(value).map(([subKey, subValue]) => (
          <p key={subKey} className="mb-1">
            <strong>{subKey.replace(/([A-Z])/g, ' $1')}:</strong>{' '}
            {typeof subValue === 'object' && subValue !== null
              ? renderValue(subValue)
              : isValidDate(subValue)
              ? new Date(subValue).toLocaleString()
              : String(subValue)}
          </p>
        ))}
      </div>
    );
  } else {
    return isValidDate(value) ? new Date(value).toLocaleString() : String(value);
  }
};

const isValidDate = (val) => {
  return typeof val === 'string' && !isNaN(Date.parse(val));
};

const PolicyCard = ({ policy, showPolicyDetails, togglePolicyDetails, policyType }) => {
  return (
    <div className="mt-4 border p-3 rounded">
      <button
        className="btn btn-secondary w-100 mb-3"
        onClick={() => togglePolicyDetails(policyType)}
      >
        {showPolicyDetails
          ? `Hide ${policyType} Policy Details`
          : `Show ${policyType} Policy Details`}
      </button>
      <div className={`collapse ${showPolicyDetails ? 'show' : ''}`}>
        <h5>Selected {policyType} Policy</h5>
        {policy ? (
          Object.entries(policy).map(([key, value]) => (
            <div key={key} className="mb-1">
              <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong>{' '}
              {renderValue(value)}
            </div>
          ))
        ) : (
          <p>No policy selected.</p>
        )}
      </div>
    </div>
  );
};

export default PolicyCard;
