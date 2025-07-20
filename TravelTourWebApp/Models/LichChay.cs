using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class LichChay
{
    [Key]
    public DateTime Ngay { get; set; }

    [ForeignKey("XeDuLich")]
    public string SoXe { get; set; }
    public XeDuLich XeDuLich { get; set; }

    [ForeignKey("HopDong")]
    public string MaHopDong { get; set; }
    public HopDongChuyenDi HopDong { get; set; }

    public string DiemDi { get; set; }
    public string DiemDen { get; set; }
    public float GiaVe { get; set; }
    public int SoKhachDi { get; set; }
}