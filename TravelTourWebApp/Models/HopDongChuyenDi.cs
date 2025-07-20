using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class HopDongChuyenDi
{
    [Key]
    public string MaHopDong { get; set; }
    public DateTime Ngay { get; set; }

    [ForeignKey("XeDuLich")]
    public string SoXe { get; set; }
    public XeDuLich XeDuLich { get; set; }

    [ForeignKey("TaiXe")]
    public string MaTX { get; set; }
    public TaiXe TaiXe { get; set; }

    [ForeignKey("HDV1")]
    public string MaHDV1 { get; set; }
    public HuongDanVien HDV1 { get; set; }

    [ForeignKey("HDV2")]
    public string MaHDV2 { get; set; }
    public HuongDanVien HDV2 { get; set; }

    public ICollection<LichChay> LichChays { get; set; }
}