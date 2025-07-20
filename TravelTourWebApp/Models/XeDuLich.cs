using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class XeDuLich
{
    [Key]
    public string SoXe { get; set; }

    [ForeignKey("LoaiXe")]
    public string MaLoai { get; set; }
    public LoaiXe LoaiXe { get; set; }

    [ForeignKey("CongTyDuLich")]
    public string MaCTY { get; set; }
    public CongTyDuLich CongTyDuLich { get; set; }

    public ICollection<LichChay> LichChays { get; set; }
    public ICollection<HopDongChuyenDi> HopDongs { get; set; }
}
