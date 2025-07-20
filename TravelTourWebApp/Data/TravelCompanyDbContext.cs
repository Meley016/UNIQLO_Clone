using Microsoft.EntityFrameworkCore;

public class TravelCompanyDbContext : DbContext
{
    public TravelCompanyDbContext(DbContextOptions<TravelCompanyDbContext> options) : base(options) { }

    public DbSet<LoaiXe> LoaiXes { get; set; }
    public DbSet<CongTyDuLich> CongTyDuLiches { get; set; }
    public DbSet<XeDuLich> XeDuLiches { get; set; }
    public DbSet<TaiXe> TaiXes { get; set; }
    public DbSet<HuongDanVien> HuongDanViens { get; set; }
    public DbSet<HopDongChuyenDi> HopDongChuyenDis { get; set; }
    public DbSet<LichChay> LichChays { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<HopDongChuyenDi>()
            .HasOne(h => h.HDV1)
            .WithMany(hdv => hdv.HopDongs1)
            .HasForeignKey(h => h.MaHDV1)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<HopDongChuyenDi>()
            .HasOne(h => h.HDV2)
            .WithMany(hdv => hdv.HopDongs2)
            .HasForeignKey(h => h.MaHDV2)
            .OnDelete(DeleteBehavior.Restrict);
    }

}
