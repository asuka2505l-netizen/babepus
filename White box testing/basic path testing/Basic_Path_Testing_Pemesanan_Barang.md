~~~mermaid
graph TD
  StartB((Start)) --> A1[1. Buyer login/auth]
  A1 --> A2[2. POST /offers]
  A2 --> A3[3. authMiddleware]
  A3 --> A4[4. createOfferValidator]
  A4 --> A5[5. validateRequest]
  A5 --> A6[6. offerController.createOffer]
  A6 --> A7[7. offerService.createOffer]
  A7 --> A8[8. Validasi produk & buat offer]
  A8 --> A9{9. Produk valid?}
  A9 -->|Ya| A10[10. Insert offer ke database]
  A9 -->|Tidak| A11[11. Error tawaran tidak valid]
  A10 --> A12[12. Tawaran berhasil dikirim]
  A11 --> End1((End))
  A12 --> End1

  StartB --> B1[13. Seller lihat incoming offer]
  B1 --> B2[14. GET /offers/incoming]
  B2 --> B3[15. offerController.getIncomingOffers]
  B3 --> B4[16. offerService.getIncomingOffers]
  B4 --> End2((End))

  StartB --> C1[17. Seller accept offer]
  C1 --> C2[18. PATCH /offers/:id/accept]
  C2 --> C3[19. validateRequest]
  C3 --> C4[20. offerController.acceptOffer]
  C4 --> C5[21. offerService.acceptOffer]
  C5 --> C6{22. Offer pending & produk aktif?}
  C6 -->|Ya| C7[23. Buat transaksi baru]
  C6 -->|Tidak| C8[24. Error tawaran tidak valid]
  C7 --> C9[25. Insert transaksi & escrow]
  C8 --> End3((End))
  C9 --> C10[26. Respon transaksi berhasil dibuat]
  C10 --> End3

  StartB --> D1[27. Seller reject offer]
  D1 --> D2[28. PATCH /offers/:id/reject]
  D2 --> D3[29. validateRequest]
  D3 --> D4[30. offerController.rejectOffer]
  D4 --> D5[31. offerService.rejectOffer]
  D5 --> End4((End))

  StartB --> E1[32. Buyer/Seller konfirmasi escrow]
  E1 --> E2[33. PATCH escrow confirm]
  E2 --> E3[34. completeTransactionValidator]
  E3 --> E4[35. transactionController.confirm]
  E4 --> E5[36. transactionService.confirmEscrow]
  E5 --> E6{37. Transaksi & escrow valid?}
  E6 -->|Ya| E7[38. Update timestamp konfirmasi]
  E6 -->|Tidak| E8[39. Error konfirmasi escrow]
  E7 --> E9[40. Release escrow & complete transaksi]
  E8 --> End5((End))
  E9 --> End5

  StartB --> F1[41. Buyer selesaikan transaksi]
  F1 --> F2[42. PATCH /transactions/:id/complete]
  F2 --> F3[43. completeTransactionValidator]
  F3 --> F4[44. transactionController.completeTransaction]
  F4 --> F5[45. transactionService.completeTransaction]
  F5 --> F6{46. Transaksi valid?}
  F6 -->|Ya| F7[47. Update completed & release escrow]
  F6 -->|Tidak| F8[48. Error transaksi]
  F7 --> End6((End))
  F8 --> End6

  E5 --> G1[49. Create notification]
  G1 --> G2[50. User menerima notifikasi]
  G2 --> End7((End))
~~~
