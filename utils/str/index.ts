export function parseDisplayName(props: {
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly userName?: string | null;
  readonly emailAddresses?: string | null;
}) {
  const { firstName, lastName, userName, emailAddresses } = props;
  if (userName && emailAddresses) {
    return userName;
  }
  if (emailAddresses) {
    const atIndex = emailAddresses.indexOf("@");
    if (atIndex !== -1) {
      const usernamePart = emailAddresses.substring(0, atIndex);
      if (/^\d+$/.test(usernamePart)) {
        return emailAddresses;
      }
      return usernamePart;
    }
    return emailAddresses;
  }
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (lastName) {
    return lastName;
  }
  return "Anonymous";
}
