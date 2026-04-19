rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ===============================================================
    // Helper Functions
    // ===============================================================
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' || 
         request.auth.token.email == "flowerscake.shop@gmail.com" ||
         request.auth.token.email == "8754388003@accounting.app" ||
         request.auth.token.email == "9994993853@accounting.app");
    }

    function isValidUser(data) {
      return data.keys().hasOnly(['role', 'phoneNumber', 'email', 'createdAt']) &&
             data.role in ['admin', 'customer', 'vendor'] &&
             (!('phoneNumber' in data) || (data.phoneNumber is string && data.phoneNumber.size() < 20)) &&
             (!('email' in data) || (data.email is string && data.email.size() < 100)) &&
             (!('createdAt' in data) || data.createdAt is string);
    }

    // ===============================================================
    // Rules
    // ===============================================================

    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      
      // Allow creation if:
      // 1. The user is creating their own profile
      // 2. The data is valid
      // 3. They aren't trying to make themselves an admin (unless they are a bootstrap admin)
      allow create: if isOwner(userId) && isValidUser(request.resource.data) && 
                      (request.resource.data.role != 'admin' || 
                       request.auth.token.email == "flowerscake.shop@gmail.com" ||
                       request.auth.token.email == "8754388003@accounting.app" ||
                       request.auth.token.email == "9994993853@accounting.app");
      
      // Allow update if:
      // 1. User is an admin
      // 2. User is the owner, data is valid, and they aren't trying to change their role
      allow update: if isAdmin() || (isOwner(userId) && isValidUser(request.resource.data) && 
                      request.resource.data.role == resource.data.role);
    }

    match /customers/{customerId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    match /vendors/{vendorId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    match /products/{productId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    match /documents/{documentId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    match /expenses/{expenseId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    match /payments/{paymentId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    match /settings/{documentId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
