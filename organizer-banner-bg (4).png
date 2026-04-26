{
  "rules": {
    ".read": false,
    ".write": false,
    "tournaments": {
      ".read": true,
      "$tournamentId": {
        ".write": true,
        ".validate": "newData.hasChildren(['settings','meta'])"
      }
    }
  }
}
