export type UserStore = {
  $id?: string;
  email?: string;
  user?: {
    userName: string;
    displayName: string;
    sex: string;
    nationalCode: string | null;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string;
    fatherName: string | null;
    postalCode: string | null;
    address: string | null;
    estate: string | null;
    city: string | null;
    mainStreet: string | null;
    subStreet: string | null;
    alley: string | null;
    pelak: string | null;
    gender: string; // "male"
    shamsiBirthDate: string | null;
    birthDate: string | null;
    signedIp: string | null;
    image: string | null;
    email: string;
    createdDate: Date | null;
    updatedDate: Date | null;
  };
  displayName?: string;
  phoneNumber?: string;
  permissions?: any[];
  roles?: [];
};
