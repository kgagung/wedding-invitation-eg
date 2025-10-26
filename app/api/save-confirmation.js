export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const confirmationData = req.body;
      console.log("Confirmation received:", confirmationData);

      res.status(200).json({
        success: true,
        message: "Konfirmasi berhasil disimpan",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menyimpan konfirmasi",
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
