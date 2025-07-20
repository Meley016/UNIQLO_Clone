using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class HuongDanVien
{
    [Key]
    public string MaHDV { get; set; }
    public string TenHDV { get; set; }
    public DateTime NgaySinh { get; set; }
    public string SoCCCD { get; set; }
    public string SDT { get; set; }
    public string DiaChi { get; set; }
    public float LuongNgay { get; set; }
    public int SoNgayLam { get; set; }

    public ICollection<HopDongChuyenDi> HopDongs1 { get; set; }
    public ICollection<HopDongChuyenDi> HopDongs2 { get; set; }
}