import React from "react";

const SocialLoginToggle = ({
  isEnabled,
  isOnlyOneLeft,
  signInMethod,
  onLink,
  onUnLink
}) => {
  return (
    <div>
      {isEnabled ? (
        <button
          disabled={isOnlyOneLeft}
          onClick={() => onLink(signInMethod.provider)}
        >
          Deactive {signInMethod.id}
        </button>
      ) : (
        <button onClick={() => onUnLink(signInMethod.id)}>
          Link {signInMethod.id}
        </button>
      )}
    </div>
  );
};

export default SocialLoginToggle;
