using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class TaiXe
{
    [Key]
    public string MaTX { get; set; }
    public string TenTX { get; set; }
    public DateTime NgaySinh { get; set; }
    public string SoCCCD { get; set; }
    public string SDT { get; set; }
    public string DiaChi { get; set; }
    public float LuongCoBan { get; set; }
    public float HeSoLuong { get; set; }

    public ICollection<HopDongChuyenDi> HopDongs { get; set; }
}