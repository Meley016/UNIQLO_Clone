using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class LoaiXe
{
    [Key]
    public string MaLoai { get; set; }
    public string TenLoai { get; set; }
    public int SoGhe { get; set; }
    public ICollection<XeDuLich> XeDuLiches { get; set; }
}